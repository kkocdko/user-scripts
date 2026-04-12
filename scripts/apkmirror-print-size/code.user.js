// https://www.apkmirror.com/uploads/page/2/?appcategory=alipay
const versions=Object.fromEntries([...document.querySelectorAll("p:first-child>.infoSlide-value")].map(v=>[v.textContent.trim().replaceAll(".","-"),""]));
for(const ver in versions)(async()=>{versions[ver]=(await(await fetch(`/apk/alipay-com/alipay/alipay-${ver}-release/alipay-${ver}-android-apk-download/`)).text()).match(/\d+.+? MB/)[0]})();
console.log(versions);
