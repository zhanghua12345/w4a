/** @type {import('tailwindcss').Config} */
const spacing = () => {
  let spacArr = {};
  for (let i = 0; i <= 375; i++) {
    spacArr[2 * i] = 2 * i + "rpx";
  }
  spacArr = {
    ...spacArr,
    "100vh": "100vh",
    main: "1220rpx",
    "30b": "-30rpx",
  };
  return spacArr;
};
module.exports = {
  content: [
    // 添加你需要提取的文件目录
    "components/**/*.{wxml,js,ts}",
    "pages/**/*.{wxml,js,ts}",
    // 不要使用下方的写法，这会导致 vite 开发时监听文件数量爆炸
    // '**/*.{js,ts,wxml}', '!node_modules/**', '!dist/**'
  ],
  theme: {
    fontSize: {
      8: "8rpx",
      10: "10rpx",
      12: "12rpx",
      14: "14rpx",
      16: "16rpx",
      18: "18rpx",
      20: "20rpx",
      22: "22rpx",
      24: "24rpx",
      26: "26rpx",
      28: "28rpx",
      30: "30rpx",
      32: "32rpx",
      36: "36rpx",
      40: "40rpx",
      48: "48rpx",
      64: "64rpx",
      100: "100rpx",
      128: "128rpx",
    },
    fontWeight: {
      // font-100
      100: 100,
      200: 200,
      300: 300,
      normal: 400,
      400: 400,
      500: 500,
      600: 600,
      700: 700,
      800: 800,
      900: 900,
    },
    lineHeight: {
      // leading-40
      40: "40rpx",
      1: 1,
      1.2: 1.2,
      1.3: 1.3,
      1.4: 1.4,
      1.8: 1.8,
      2: 2,
    },
    borderWidth: {
      // border-0
      default: "2rpx",
      0: "0",
      2: "2rpx",
      4: "4rpx",
      6: "6rpx",
      8: "8rpx",
      10: "10rpx",
      12: "12rpx",
      14: "14rpx",
      16: "16rpx",
      18: "18rpx",
      20: "20rpx",
    },
    borderRadius: {
      // rounded-4
      main: "10rpx",
      0: "0rpx",
      4: "4rpx",
      6: "6rpx",
      8: "8rpx",
      12: "12rpx",
      16: "16rpx",
      20: "20rpx",
      24: "24rpx",
      28: "28rpx",
      32: "32rpx",
      40: "40rpx",
      46: "46rpx",
      full: "1000rpx",
    },
    backgroundSize: {
      full: "100% 100%",
    },
    spacing: { ...spacing(), main: "28rpx" },
    extend: {
      colors: {
        main: "#F9637B",
        fff: "#fff",
        FF477C: "#FF477C",
        f0f0f0: "#f0f0f0",
        FF0049: "#FF0049",
        522235: "#522235",
        "1c1c1e": "#1c1c1e",
        "2F3034": "#2F3034",
        FF313B: "#FF313B",
        "57C541": "#57C541",
        373737: "#373737",
        "272A30": "#272A30",
        "000": "#000",
        "fff-25": "rgba(255, 255, 255, 0.25)",
        "fff-10": "rgba(255, 255, 255, 0.1)",
        353535: "#353535",
        "6B6B6B": "#6B6B6B",
        707070: "#707070",
        "8E8E8E": "#8E8E8E",
        D9D9D9: "#D9D9D9",
        "200-95": "rgba(200, 200, 200, 0.95)",
        secondary: {
          "000": "linear-gradient(red, yellow, blue)",
        },
      },
      zIndex: {
        "1b": "-1",
        2: 2,
      },
    },
  },
  // 假如你使用 ts 模板，则可以使用下方的配置
  // content: ['miniprogram/**/*.{ts,js,wxml}'],
  corePlugins: {
    // 小程序不需要 preflight 和 container，因为这主要是给 h5 的，如果你要同时开发小程序和 h5 端，你应该使用环境变量来控制它
    preflight: false,
    container: false,
  },
};
