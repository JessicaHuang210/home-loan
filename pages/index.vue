<template>
  <UContainer>
    <h1>房貸試算</h1>
    <p class="text-gray-400 dark:text-gray-500">
      本金平均攤還，單一利率，計算方式參考國泰世華銀行
    </p>
    <div class="flex flex-col md:flex-row gap-10 mb-10">
      <div class="md:basis-1/2">
        <UForm :validate="validate" :state="formModel" @submit="handleSubmit">
          <div class="flex flex-col md:flex-row gap-5">
            <UFormGroup
              name="totalAmount"
              label="貸款金額"
              class="mb-4 md:basis-1/2"
              required
            >
              <UInput
                type="number"
                placeholder="請輸入貸款金額"
                v-model="formModel.totalAmount"
                size="xl"
              >
                <template #trailing>萬</template>
              </UInput>
            </UFormGroup>
            <UFormGroup
              name="rate"
              label="貸款利率(年利率%)"
              class="mb-4 md:basis-1/2"
              require
            >
              <UInput
                type="number"
                placeholder="請輸入貸款利率(年利率%)"
                v-model="formModel.rate"
                size="xl"
                step="0.01"
              >
                <template #trailing>%</template>
              </UInput>
            </UFormGroup>
          </div>
          <UFormGroup label="貸款分期" class="mb-4" required>
            <UInput
              type="number"
              placeholder="請輸入要分幾年"
              v-model="formModel.year"
              size="xl"
              step="1"
            >
              <template #trailing>年</template>
            </UInput>
          </UFormGroup>
          <UFormGroup class="mb-4 md:basis-1/4">
            <UButton block size="lg" type="submit">計算</UButton>
          </UFormGroup>
        </UForm>
      </div>
      <UCard class="md:basis-1/2">
        <ul class="desc px-4 py-5 sm:p-6 md:basis-1/2">
          <li class="text-green-500">
            <span class="title text-gray-700 dark:text-gray-400"
              >每月還款：</span
            >
            {{ states.arr?.[0]?.amount?.toLocaleString("en-US") }}
            <span class="title text-slate-600 dark:text-slate-300">
              元/月 (遞減)
            </span>
          </li>
          <li>
            <span class="title text-gray-700 dark:text-gray-400">期數：</span
            >{{ states.period }}期 ({{ formModel.year }}年)
          </li>
          <li>
            <span class="title text-gray-700 dark:text-gray-400">本金：</span>
            {{ states.principal.toLocaleString("en-US") }}
          </li>
          <li>
            <span class="title text-gray-700 dark:text-gray-400">利息：</span>
            {{ states.rateAll.toLocaleString("en-US") }}
          </li>
          <li>
            <span class="title text-gray-700 dark:text-gray-400">本利和：</span>
            {{ (states.principal + states.rateAll).toLocaleString("en-US") }}
          </li>
        </ul>
      </UCard>
    </div>
    <div class="table-scroll" ref="tableScrollRef">
      <UTable
        :rows="states.arr"
        :columns="columns"
        :empty-state="{ label: '暫無資料' }"
      >
        <template #period-data="{ row }"> 第 {{ row.period }} 個月 </template>
        <template #principalM-data="{ row }">
          {{ row.principalM.toLocaleString("en-US") }}
        </template>
        <template #rateM-data="{ row }">
          {{ row.rateM.toLocaleString("en-US") }}
        </template>
        <template #amount-data="{ row }">
          <span class="text-lg font-black text-green-500">
            {{ row.amount.toLocaleString("en-US") }}
          </span>
          元
        </template>
        <template #restPrincipal-data="{ row }">
          {{ row.restPrincipal.toLocaleString("en-US") }}
        </template>
      </UTable>
    </div>
    <div class="flex flex-wrap gap-3 mt-20">
      <UBadge color="gray" variant="solid" v-for="i in tags" :key="i">
        #{{ i }}
      </UBadge>
    </div>
  </UContainer>

  <footer class="mt-20 p-4 text-center bg-slate-50 dark:bg-slate-800">
    <h6 class="text-gray-400 dark:text-gray-200 text-sm">
      2023
      <ULink to="https://penueling.com" target="_blank"
        >penueling 磐凌科技</ULink
      >
    </h6>
  </footer>
</template>
<script setup>
const formModel = reactive({
  totalAmount: 800,
  rate: 2.2,
  year: 20,
});

const validate = (state) => {
  const errors = [];
  if (!state.totalAmount)
    errors.push({ path: "totalAmount", message: "必填欄位" });
  if (!state.rate) errors.push({ path: "rate", message: "必填欄位" });
  return errors;
};

const states = reactive({
  principal: computed(() => formModel.totalAmount * 10000), // 貸款總額
  principalM: computed(() => Math.round(states.principal / states.period)), //每月償還本金
  period: computed(() => formModel.year * 12), // 貸款期數
  rateM: computed(() => formModel.rate / 100 / 12), // 貸款期數
  arr: [],
  rateAll: computed(() => states.arr.reduce((a, b) => a + b.rateM, 0)),
});

const columns = ref([
  {
    key: "period",
    label: "期數",
  },
  {
    key: "principalM",
    label: "還款本金",
  },
  {
    key: "rateM",
    label: "還款利息",
  },
  {
    key: "amount",
    label: "每月還款金額",
  },
  {
    key: "restPrincipal",
    label: "剩餘本金",
  },
]);

const tags = ref([
  "貸款試算",
  "本金平均攤還",
  "房貸利息試算",
  "房貸利息計算",
  "房貸每月攤還",
]);
const tableScrollRef = ref(null);

const handleSubmit = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  tableScrollRef.value.scrollTo({ top: 0, behavior: "smooth" });
  const newArr = [];
  for (let i = 0; i < states.period; i++) {
    const _principalMRound = Math.round(states.principal / states.period); // 四捨五入的每月本金
    const _principalRoundDeviation =
      Math.round(states.principal / states.period) * states.period -
      states.principal; // 四捨五入的每月本金*期數-真正本金(誤差)
    const __principalMLast = _principalMRound - _principalRoundDeviation;
    const _principalM =
      i < states.period - 1 ? _principalMRound : __principalMLast;
    const _rateM = Math.round(
      (states.principal - states.principalM * i) * states.rateM
    );

    const _restPrincipal = states.principal - states.principalM * (i + 1);
    newArr.push({
      period: i + 1,
      principalM: _principalM,
      rateM: _rateM,
      amount: _principalM + _rateM,
      restPrincipal:
        i < states.period - 1
          ? _restPrincipal
          : _restPrincipal + _principalRoundDeviation,
    });
  }
  states.arr = newArr;
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 90px auto 10px;
  font-size: 44px;
  letter-spacing: 2px;
}
p {
  text-align: center;
  margin-bottom: 50px;
}
.desc li {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
}
.desc li:not(:last-child) {
  margin-bottom: 20px;
  display: flex;
}
.desc span.title {
  display: block;
  min-width: 100px;
  font-size: 15px;
  font-weight: normal;
  letter-spacing: 0;
}
.table-scroll {
  max-height: 500px;
  overflow-y: auto;
}
</style>
