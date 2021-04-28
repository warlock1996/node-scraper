
// let instagram_url = "https://www.instagram.com/willsmith";
// let facebook_url = "https://web.facebook.com/WillSmith";

// let instagram_followers, facebook_followers;
// async function run() {
//   const browser = await puppeteer.launch();

//   const facebook = await browser.newPage();
//   const instagram = await browser.newPage();

//   facebook.on("console", (msg) => {
//     for (let i = 0; i < msg.args.length; ++i)
//       console.log(`${i}: ${msg.args[i]}`);
//   });
//   instagram.on("console", (msg) => {
//     for (let i = 0; i < msg.args.length; ++i)
//       console.log(`${i}: ${msg.args[i]}`);
//   });

//   await facebook.goto(facebook_url);
//   await instagram.goto(instagram_url);

//   const spans_f = await facebook.$$("span");
//   const spans = await instagram.$$("ul li a");

//   for (let i = 0; i < spans.length; i++) {
//     const element_i = spans[i];
//     const txt_i = await instagram.evaluate(
//       (element_i) => element_i.textContent,
//       element_i
//     );
//     console.log(txt_i)
//     if (txt_i.includes("followers")) {
//       instagram_followers = txt_i.split(" ")[0];
//     }
//   }

//   for (let i = 0; i < spans_f.length; i++) {
//     const element = spans_f[i];
//     const txt = await facebook.evaluate(
//       (element) => element.textContent,
//       element
//     );
//     if (txt.includes("followers")) {
//       facebook_followers = txt.split(" ")[0];
//     }
//   }
//   await facebook.close()
//   await instagram.close()
// }
// run().then(() => {
//   console.log("facebook_followers", facebook_followers);
//   console.log("instagram_followers", instagram_followers);
// });
