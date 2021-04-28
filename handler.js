const puppeteer = require("puppeteer");

exports.getFollowers = async (req, res, next) => {
  try {
    //   if (!req.body.facebookURL || !req.body.instagramURL) {
    //     return res.json({
    //       message: "must include facebook and instagram urls in request params.",
    //     });
    //   }

    let instagram_followers, facebook_followers;

    const browser = await puppeteer.launch();

    const facebook = await browser.newPage();
    const instagram = await browser.newPage();

    facebook.on("console", (msg) => {
      for (let i = 0; i < msg.args.length; ++i)
        console.log(`${i}: ${msg.args[i]}`);
    });
    instagram.on("console", (msg) => {
      for (let i = 0; i < msg.args.length; ++i)
        console.log(`${i}: ${msg.args[i]}`);
    });

    await facebook.goto(req.body.facebookURL);
    await instagram.goto(req.body.instagramURL);

    const spans_f = await facebook.$$("span");
    const spans = await instagram.$$("ul li a");

    for (let i = 0; i < spans.length; i++) {
      const element_i = spans[i];
      const txt_i = await instagram.evaluate(
        (element_i) => element_i.textContent,
        element_i
      );
      if (txt_i.includes("followers")) {
        instagram_followers = txt_i.split(" ")[0];
      }
    }

    for (let i = 0; i < spans_f.length; i++) {
      const element = spans_f[i];
      const txt = await facebook.evaluate(
        (element) => element.textContent,
        element
      );
      if (txt.includes("followers")) {
        facebook_followers = txt.split(" ")[0];
      }
    }
    await facebook.close();
    await instagram.close();

    res.json({
      facebook: facebook_followers,
      instagram: instagram_followers,
    });
  } catch (error) {
    res.json(error);
  }
};