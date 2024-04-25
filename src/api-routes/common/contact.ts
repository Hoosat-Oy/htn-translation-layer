import Mailer from '../../lib/common/Mailer';
import { rateLimitByIP } from '../../lib/common/rateLimit';
import { createRouter } from '../../core/server';
import { DEBUG } from '../../core/errors';

const contactRouter = createRouter();

contactRouter.Post("/api/contact/meeting", async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const rate = await rateLimitByIP(ip, 2500);
    if(rate === true) {
      // First send email to our address with the contact form data.
      const myyntiMail = "myynti@hoosat.fi"
      const message = `Lähettäjän sähköpostiosoite: ${req.body.from}\r\n\r\n${req.body.message}\r\n\r\nMarketing allowed:${req.body.marketing}`
      Mailer.sendMail({ from: req.body.from, replyTo: req.body.from, sender: req.body.from, to: myyntiMail, subject: "Hoosat.fi palaveri varaus.", text: message });
      // Then send automatic reply for confirmation to the sender.
      const automaticReply = `Hei\r\n\r\nTämä on automaattinen vastaus.\r\n\r\nOlemme yhteydessä mahdollisimman nopeasti, mutta jos meistä ei sähköpostilla kuulu tarpeeksi nopeasti koita soittaa meille.\r\n\r\nYstävällisin terveisin,\r\nHoosat Oy`;
      Mailer.sendMail({ from: myyntiMail, replyTo: myyntiMail, sender: myyntiMail, to: req.body.from, subject: "Hoosat.fi palaveri varaus.", text: automaticReply });
    }
    return res.status(200).json({ result: "success", message: "Contact request has been sent."})
  } catch (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

export {
  contactRouter,
}