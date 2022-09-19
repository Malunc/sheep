/** 
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐│
 *  ││Esc│!1 │@2 │#3 │$4 │%5 │^6 │&7 │*8 │(9 │)0 │_- │+= │|\ │`~ ││
 *  │├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴───┤│
 *  ││ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{[ │}] │ BS  ││
 *  │├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤│
 *  ││ Ctrl │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  ││
 *  │├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────┬───┤│
 *  ││ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│Shift │Fn ││
 *  │└─────┬──┴┬──┴──┬┴───┴───┴───┴───┴───┴──┬┴───┴┬──┴┬─────┴───┘│
 *  │      │Fn │ Alt │         Space         │ Alt │Win│   HHKB   │
 *  │      └───┴─────┴───────────────────────┴─────┴───┘          │
 *  └─────────────────────────────────────────────────────────────┘
 * 
 * @Description: 
 * @Author: hgh
 * @Date: 2022-09-19 14:20:16
 * @LastEditTime: 2022-09-19 14:20:16
*/

// 获取用户信息接口
const get_user_info_api = "https://cat-match.easygame2021.com/sheep/v1/game/user_info"
// 用户登录接口，POST请求 需要wx_open_id
const user_login_api = "https://cat-match.easygame2021.com/sheep/v1/user/login_oppo"
// 完成羊群接口
const finish_sheep_api = "https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex"
// 完成话题接口
const finish_topic_api = "https://cat-match.easygame2021.com/sheep/v1/game/topic_game_over"

let success = 0, fail = 0, topSuccess = 0, topFail = 0, openid, token;

const axios = require('axios');
// 重试次数
axios.defaults.retry = 2;
// 请求的间隙
axios.defaults.retryDelay = 1000;
//请求超时时间
axios.defaults.timeout = 10000;

init();

async function init() {
  const uid = process.argv[2];
  console.log('开始获取openid');
  openid = await getOpenId(uid);
  while (openid == undefined) {
    console.log('获取openid失败');
    openid = await getOpenId(uid);
  }
  console.log('已成功获取openid', openid);

  console.log('开始获取token');
  token = await getToken(openid);
  while (token == undefined) {
    console.log('获取token失败');
    token = await getToken(openid);
  }
  console.log('已成功获取token', token);
  setInterval(() => {
    finishLevel(token);
    finishTopics(token);
  }, 1500)
}
// uid: 13758563   
// uid: 250174009 
async function getOpenId(uid) {
  try {
    const res = await axios.get(`${get_user_info_api}?uid=${uid}`,
      {
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip,compress,br,deflate',
          'Connection': 'keep-alive',
          'content-type': 'application/json',
          'Referer': 'https://servicewechat.com/wx141bfb9b73c970a9/16/page-frame.html',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 12; M2012K11C Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/4313 MMWEBSDK/20220805 Mobile Safari/537.36 MMWEBID/4629 MicroMessenger/8.0.27.2220(0x28001B37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
          't': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQ1MDI0NDUsIm5iZiI6MTY2MzQwMDI0NSwiaWF0IjoxNjYzMzk4NDQ1LCJqdGkiOiJDTTpjYXRfbWF0Y2g6bHQxMjM0NTYiLCJvcGVuX2lkIjoiIiwidWlkIjo0NTk0MjYwMiwiZGVidWciOiIiLCJsYW5nIjoiIn0.1lXIcb1WL_SdsXG5N_i1drjjACRhRZUS2uadHlT6zIY'
        }
      });

    const response = res.data;
    const openid = response.data.wx_open_id;
    return openid;
  } catch (e) {
    console.log(`获取openid失败，请稍后重试！`);
  }
}

async function getToken(openid) {
  try {
    const res = await axios.post(user_login_api,
      {
        uid: openid,
        avatar: "1",
        nick_name: "1",
        sex: 1,
        timeout: 15,
      },
      {
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip,compress,br,deflate',
          'Connection': 'keep-alive',
          'content-type': 'application/json',
          'Referer': 'https://servicewechat.com/wx141bfb9b73c970a9/16/page-frame.html',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 12; M2012K11C Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/4313 MMWEBSDK/20220805 Mobile Safari/537.36 MMWEBID/4629 MicroMessenger/8.0.27.2220(0x28001B37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
          't': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQ1MDI0NDUsIm5iZiI6MTY2MzQwMDI0NSwiaWF0IjoxNjYzMzk4NDQ1LCJqdGkiOiJDTTpjYXRfbWF0Y2g6bHQxMjM0NTYiLCJvcGVuX2lkIjoiIiwidWlkIjo0NTk0MjYwMiwiZGVidWciOiIiLCJsYW5nIjoiIn0.1lXIcb1WL_SdsXG5N_i1drjjACRhRZUS2uadHlT6zIY'
        }
      });
    const response = res.data;
    const token = response.data.token;

    console.log(response, 'response');
    return token;
  } catch (e) {
    console.log(e, 'e');
    console.log('获取token失败，请稍后重试！');
  }
}

function finishLevel(token) {
  const rank_time = Math.floor(Math.random() * 10000);
  axios.post(finish_sheep_api,
    {
      "rank_score": 1,
      "rank_state": 1,
      "rank_time": rank_time,
      "rank_role": 1,
      "skin": 1,
      "MatchPlayInfo": token
    },
    {
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,compress,br,deflate',
        'Connection': 'keep-alive',
        'content-type': 'application/json',
        'Referer': 'https://servicewechat.com/wx141bfb9b73c970a9/16/page-frame.html',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; M2012K11C Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/4313 MMWEBSDK/20220805 Mobile Safari/537.36 MMWEBID/4629 MicroMessenger/8.0.27.2220(0x28001B37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
        't': token
      }
    })
    .then(res => {
      success++;
      // console.log(res.data);
    })
    .catch(error => {
      console.log(error);
      fail++;
    })
    .finally(() => {
      console.log(`====================羊了个羊勇敢通关${success}次====================`);
      console.log(`====================羊了个羊闯关失败${fail}次====================`);
    })
    ;
}

function finishTopics(token) {
  const rank_time = Math.floor(Math.random() * 10000);
  axios.get(`${finish_topic_api}?rank_score=1&rank_state=1&rank_time=${rank_time}&rank_role=2&skin=1`,
    {
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,compress,br,deflate',
        'Connection': 'keep-alive',
        'content-type': 'application/json',
        'Referer': 'https://servicewechat.com/wx141bfb9b73c970a9/16/page-frame.html',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; M2012K11C Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/4313 MMWEBSDK/20220805 Mobile Safari/537.36 MMWEBID/4629 MicroMessenger/8.0.27.2220(0x28001B37) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
        't': token
      }
    })
    .then(res => {
      topSuccess++;
      // console.log(res.data);
    })
    .catch(error => {
      console.log(error);
      topFail++;
    })
    .finally(() => {
      console.log(`********************话题通关成功${topSuccess}次********************`);
      console.log(`********************话题通关失败${topFail}次********************`);
    })
    ;
}
