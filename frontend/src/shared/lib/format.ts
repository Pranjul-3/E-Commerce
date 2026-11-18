import dayjs from "dayjs";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatMoney = (value: number): string => money.format(value);
export const formatDay = (iso: string): string => dayjs(iso).format("D MMMM YYYY");
