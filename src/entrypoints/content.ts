export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("HTML.MD content script loaded");
  },
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_CONTENT") {
    const htmlContent = document.body.innerHTML;
    const pageTitle = document.title;
    sendResponse({ html: htmlContent, title: pageTitle });
  }
  return false;
});
