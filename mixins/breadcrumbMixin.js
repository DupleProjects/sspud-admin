export default {
  methods: {
    savePage(pageName, page) {
      // Get current pageObject
      let pageHistory = window.sessionStorage.getItem('pageHistory');
      if (pageHistory && (typeof pageHistory === 'string' || pageHistory instanceof String)) {
        pageHistory = JSON.parse(pageHistory);
      } else {
        pageHistory = {}
      }
      const pagePosition = document.documentElement.scrollTop || document.body.scrollTop;
      pageHistory[pageName] = {
        page,
        pagePosition
      }
      const stringifiedPageHistory = JSON.stringify(pageHistory);
      window.sessionStorage.setItem('pageHistory', stringifiedPageHistory);
    },
    getPage(pageName) {
      let pageHistory = window.sessionStorage.getItem('pageHistory');
      if (pageHistory && (typeof pageHistory === 'string' || pageHistory instanceof String)) {
        pageHistory = JSON.parse(pageHistory);
        if (pageHistory.hasOwnProperty(pageName)) {
          window.scrollTo(0, pageHistory[pageName].pagePosition)
          console.log('pageHistory[pageName].pagePosition', pageHistory[pageName].pagePosition)
          return pageHistory[pageName]
        }
      }
      return {
        page: 1,
        pagePosition: 0
      };
    },
    clear() {
      const stringifiedPageHistory = JSON.stringify({});
      window.sessionStorage.setItem('pageHistory', stringifiedPageHistory);
    }
  }
}
