// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/penueling-512x512.png" },
      ],
      title: "房貸試算 - 本金平均攤還",
      meta: [
        {
          name: " description",
          content:
            "房貸試算，房貸試算表，房貸試算表2023，房貸計算器，貸款計算器，房貸計算器2023，貸款試算，本金平均攤還，房貸利息試算，房貸利息計算，房貸每月攤還",
        },
      ],
    },
  },
});
