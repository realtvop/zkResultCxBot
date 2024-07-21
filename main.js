const { checkInterval, botToken, userId, cookie } = require("./config.js");

function getRestlt() {
    return fetch("https://zhongkao.gzzk.cn/cx/result_list.asp", {
        method: 'POST',
        headers: {
            cookie,
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "connection": "keep-alive",
            // "content-length": "8",
            "content-type": "application/x-www-form-urlencoded",
            "dnt": "1",
            "host": "zhongkao.gzzk.cn",
            "origin": "https://zhongkao.gzzk.cn",
            "pragma": "no-cache",
            "referer": "https://zhongkao.gzzk.cn/cx/index_check.asp",
            "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "macOS",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        },
        body: "leibie=0",
    })
        .then(r => r.text())
        .then(t => t.match(/<CENTER><p class='font-n font-blod'>(.*?)<\/font><\/center>/i))
        .then(r => {
            if (!r || !r[1]) return ["😡 查询出错!!!", true];
            if (r[1] == "暂时还没有你的录取结果！请根据公布的批次线和个人成绩按录取时间安排来查询！") return ["还没到喵~别急", false];
            return ["🎉 录取上了!!!!!", true];
        })
        .catch(() => ["😡 查询出错!!!", true]);
}

function getAndSend() {
    getRestlt().then(r => {
        console.log(r);
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: userId,
                    text: r[0],
                    disable_notification: !r[1],
                }),
            }
        );
    })
}

getAndSend();
setInterval(getAndSend, checkInterval * 60e3);