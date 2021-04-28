const puppeteer = require("puppeteer");

exports.getFollowers = async (req, res, next) => {
  var instagram_followers, facebook_followers;

  try {
    if (!req.body.facebookURL || !req.body.instagramURL) {
      return res.json({
        message: "must include facebook and instagram urls in request body.",
      });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

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

    console.log("spans_f, spans,", spans_f, spans);

    for (let i = 0; i < spans.length; i++) {
      const element_i = spans[i];
      const txt_i = await instagram.evaluate(
        (element_i) => Promise.resolve(element_i.textContent),
        element_i
      );
      console.log(txt_i);
      if (txt_i.includes("followers")) {
        instagram_followers = txt_i.split(" ")[0];
      }
    }

    for (let j = 0; j < spans_f.length; j++) {
      const element = spans_f[j];
      const txt = await facebook.evaluate(
        (element) => Promise.resolve(element.textContent),
        element
      );

      console.log(txt);
      if (txt.includes("followers")) {
        facebook_followers = txt.split(" ")[0];
      }
    }
    await facebook.close();
    await instagram.close();

    res.json({
      success: true,
      facebook: facebook_followers,
      instagram: instagram_followers,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error,
      facebook: facebook_followers,
      instagram: instagram_followers,
    });
  }
};
