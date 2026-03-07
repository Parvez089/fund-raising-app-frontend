/** @format */

import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import path from "path";
import fs from "fs";

const locales = ["en", "bn"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return {
    locale: locale as string,
    messages,
  };
});