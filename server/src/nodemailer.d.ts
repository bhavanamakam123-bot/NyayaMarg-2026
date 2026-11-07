declare module "nodemailer" {
  export function createTransport(options: object): { sendMail: (mail: object) => Promise<unknown> };
}
