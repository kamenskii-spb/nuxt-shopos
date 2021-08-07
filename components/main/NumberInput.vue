<template>
  <div class="input-group">
    <input
      type="button"
      :disabled="loading"
      value="-"
      class="button-minus"
      @click="minus"
    />
    <input
      type="number"
      :step="step"
      min="1"
      :value="value"
      class="quantity-field"
      @change="change('_', $event)"
    />
    <input
      type="button"
      :disabled="loading"
      value="+"
      class="button-plus"
      @click="plus"
    />
  </div>
</template>

<script>
export default {
  props: ["value", "step", "loading"],
  methods: {
    plus() {
      this.$emit("inputChange", +this.value + +this.step);
    },
    minus() {
      const val = +this.value - +this.step;
      if (val < 1) return;
      this.$emit("inputChange", val);
    },
    change(t, $event) {
      const round = (n, s) => {
        var func = n % s < s / 2 ? Math.floor : Math.ceil;
        return func(n / s) * s;
      };
      $event.target.value = round(+$event.target.value, +this.step);
      if (+$event.target.value <= this.step) $event.target.value = +this.step;
      this.$emit("inputChange", +$event.target.value);
    },
  },
};
</script>

<style scoped>
input,
textarea {
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  margin: 0;
  outline: none;
  padding: 10px;
}

input[type="button"] {
  -webkit-appearance: button;
  cursor: pointer;
}

input[disabled="disabled"] {
  opacity: 0.6;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
 
input[type="number"] {
    -moz-appearance: textfield !important;
}

.input-group {
  clear: both;
  margin: 0;
  position: relative;
  display: inline-flex;
  /* width: 100%;
        display: flex;
        justify-content: center; */
}

.input-group input[type="button"] {
  background-color: #eeeeee;
  min-width: 35px;
  width: auto;
  transition: all 300ms ease;
}

.input-group .button-minus,
.input-group .button-plus {
  font-weight: bold;
  height: 38px;
  padding: 0;
  width: 38px;
  position: relative;
}

.input-group .quantity-field {
  position: relative;
  height: 38px;
  left: -6px;
  text-align: center;
  width: 62px;
  display: inline-block;
  font-size: 13px;
  margin: 0 0 5px;
  resize: vertical;
}

.button-plus {
  left: -13px;
}

input[type="number"] {
  -moz-appearance: textfield;
  -webkit-appearance: none;
}
</style>
