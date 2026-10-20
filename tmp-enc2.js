const {execSync}=require("child_process");
const t=execSync("git show HEAD:\"src/app/(dashboard)/dashboard/services/[serviceId]/page.tsx\"").toString("utf8");
console.log("naira U+20A6 count in Odeda HEAD:", (t.match(/\u20A6/g)||[]).length);
console.log("replacement char count:", (t.match(/\uFFFD/g)||[]).length);
