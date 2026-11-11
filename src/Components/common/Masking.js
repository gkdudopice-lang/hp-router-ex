// 1. 이름 마스킹 (예: 이하영 -> 이*영, 홍길동 -> 홍*동)
export const maskName = (name) => {
  if (!name) return "";
  if (name.length <= 2) {
    return name[0] + "*";
  }
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

// 2. 휴대폰 번호 마스킹 (예: 010-6666-2222 -> 010-****-2222)
export const maskPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{3})-?(\d{4})-?(\d{4})/, "$1-****-$3");
};

// 3. 이메일 마스킹 (예: gkdudopice@gmail.com -> gkd*******@gmail.com)
export const maskEmail = (email) => {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  const visibleLength = localPart.length > 3 ? 3 : 1;
  const maskedLocal =
    localPart.substring(0, visibleLength) +
    "*".repeat(localPart.length - visibleLength);

  return `${maskedLocal}@${domain}`;
};
