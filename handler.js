const puppeteer = require("puppeteer");

exports.getFollowers = async (req, res, next) => {
  let facebook_followers, instagram_followers;

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
      for (let a = 0; a < msg.args.length; ++a)
        console.log(`${a}: ${msg.args[a]}`);
    });
    instagram.on("console", (msg) => {
      for (let b = 0; b < msg.args.length; ++b)
        console.log(`${b}: ${msg.args[b]}`);
    });

    await facebook.goto(req.body.facebookURL);
    await instagram.goto(req.body.instagramURL);

    const spanElements = await facebook.$$("div span");
    const spans = await instagram.$$("ul li a");

     for (let j = 0; j < spanElements.length; j++) {
       const element = spanElements[j];
       const txt = await facebook.evaluate((element) => {
         return Promise.resolve(element.textContent);
       }, element);

       console.log(txt);
       if (txt.includes("followers")) {
         facebook_followers = txt.split(" ")[0];
       }
     }
     

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

   
    await facebook.close();
    await instagram.close();

    return res.json({
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
