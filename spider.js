#!/usr/bin/env node
const { Command } = require("commander");
const fetch = require("node-fetch");
const program = new Command();
console.log("Hello spider!");
if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  program
    .option("-c, --concurrency <number>", "并发数", 1)
    .arguments("<url...>")
    .action(async function (url) {
      const { concurrency } = program.opts();
      console.log(`url: ${url}`);
      // const urls = new Array(Number(concurrency)).fill(url);
      const urls = new Array(10).fill(url);
      const c = Number(concurrency);
      // color blue
      console.log(
        '\x1b[34m%s\x1b[0m',
        `开始爬取，共${urls.length}条,并发数${c}条`
      );
      for (let i = 0; i < urls.length; i += c) {
        // color green
        console.log('\x1b[32m%s\x1b[0m', `第 ${i / c + 1} 批开始!`);
        const concurrentUrls = urls.slice(i, i + c);
        await Promise.all(concurrentUrls.map(fetchUrl))
          .then(() => {
            // color yellow
            console.log('\x1b[33m%s\x1b[0m', `第 ${i / c + 1} 批结束!`);
          })
          .catch((err) => {
            console.log('\x1b[31m%s\x1b[0m', `第 ${i / c + 1} 批错误: ${err}`);
          });
      }
    });
  program.parse(process.argv);
}
function fetchUrl(url) {
  return fetch(url)
    .then((res) => {
      console.log(`Status :${res.status}`);
      return res.text();
    })
    .then((text) => {
      console.log(`Length: ${text.length}`);
      return text;
    })
    .catch((err) => {
      console.error('\x1b[31m%s\x1b[0m', `错误: ${err}`);
      throw err;
    });
}
