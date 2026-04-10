import nodemailer from 'nodemailer';
import { gmail_v1 } from '@googleapis/gmail';
import path from 'path';
import { google } from 'googleapis';

class EmailService {
    private transporter: nodemailer.Transporter | undefined;
    private gmailClient: gmail_v1.Gmail | undefined;

    constructor() {
        this.init();
    }

    private async init() {
        if (process.env.NODE_ENV !== 'production') {
            try {
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                console.log('Ethereal test account created.');
            } catch (error) {
                console.error('Failed to create Ethereal account:', error);
            }
        } else {
            console.log('\nInitializing Gmail API for production...\n');
            
            const oauth2Client = new google.auth.OAuth2(
                process.env.OAUTH_CLIENT_ID,
                process.env.OAUTH_CLIENT_SECRET,
                "https://developers.google.com/oauthplayground"
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.OAUTH_REFRESH_TOKEN
            });

            // Inicializa o cliente da API do Gmail
            this.gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
            console.log('Gmail API client initialized for production.');
        }
    }

    async sendEmail(to: string, msg: string) {
        // Garantir inicialização
        if (process.env.NODE_ENV === 'production' && !this.gmailClient) await this.init();
        if (process.env.NODE_ENV !== 'production' && !this.transporter) await this.init();

        const mailOptions = {
            from: `"Apalogio" <${process.env.OAUTH_USER_EMAIL}>`,
            to: to,
            subject: 'Email do Apalogio',
            html: `
                <div style="font-family: sans-serif; text-align: center;">
                    <h2>Email</h2>
                    <p>Olá,</p>
                    <p>essa mensagem veio diretamente da execucao de um agente.</p>
                    <h1 style="letter-spacing: 2px;">${msg}</h1>
                    <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
                </div>
            `,
        };

        try {
            if (process.env.NODE_ENV === 'production' && this.gmailClient) {
                // --- LÓGICA DE PRODUÇÃO (GMAIL API) ---
                
                // 1. Usamos um transporte "fake" do nodemailer para gerar o MIME bruto (RFC822)
                const tempTransporter = nodemailer.createTransport({ streamTransport: true, buffer: true } as any);
                const processedEmail: any = await tempTransporter.sendMail(mailOptions);
                
                // 2. Codifica em Base64 URL Safe (Exigência da Gmail API)
                // processedEmail.message is a Buffer when buffer: true is used in streamTransport
                const messageBuffer = Buffer.isBuffer(processedEmail.message) ? processedEmail.message : Buffer.from(processedEmail.message);
                const encodedMessage = messageBuffer
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                // 3. Envia via HTTPS (Porta 443) - Adeus Timeout e Blacklist de IP!
                const res = await this.gmailClient.users.messages.send({
                    userId: 'me',
                    requestBody: { raw: encodedMessage }
                });

                console.log('Email sent via Gmail API:', res.data.id);
            } else if (this.transporter) {
                console.log(`MSG for ${to}: ${msg}`);  // mostra no console para desenvolvimento
                // --- LÓGICA DE DEV (ETHEREAL) ---
                const info = await this.transporter.sendMail(mailOptions);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Could not send OTP email.');
        }
    }
}

export default new EmailService();