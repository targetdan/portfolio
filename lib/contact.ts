const parts = ["ZGFuaWVsd2lsc2hlcg==", "cmVjcnVpdG1lbnQ=", "aG90bWFpbA==", "Y28udWs="];

export function openEmail() {
  const [user, tag, domain, tld] = parts.map(p => atob(p));
  window.location.href = `mailto:${user}+${tag}@${domain}.${tld}`;
}
