export default {
  methods: {
    savePageAndFilter(pageName, pageFilterSort) {
      // Get current pageObject
      let pageHistory = window.sessionStorage.getItem('pageHistory');
      if (pageHistory && (typeof pageHistory === 'string' || pageHistory instanceof String)) {
        pageHistory = JSON.parse(pageHistory);
      } else {
        pageHistory = {}
      }
      const pagePosition = document.documentElement.scrollTop || document.body.scrollTop;
      pageHistory[pageName] = {
        pagination: {
          page: pageFilterSort.page ? pageFilterSort.page : 1,
          pagePosition
        },
        filter: pageFilterSort.filter ? pageFilterSort.filter : {},
        sort: pageFilterSort.sort ? pageFilterSort.sort : {}
      }
      const stringifiedPageHistory = JSON.stringify(pageHistory);
      window.sessionStorage.setItem('pageHistory', stringifiedPageHistory);
    },
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
          return pageHistory[pageName]
        }
      }
      return {
        page: 1,
        pagePosition: 0
      };
    },
    getPageWithSort(pageName) {
      let pageHistory = window.sessionStorage.getItem('pageHistory');
      if (pageHistory && (typeof pageHistory === 'string' || pageHistory instanceof String)) {
        pageHistory = JSON.parse(pageHistory);
        if (pageHistory.hasOwnProperty(pageName)) {
          window.scrollTo(0, pageHistory[pageName].pagePosition)
          return pageHistory[pageName]
        }
      }
      return {
        pagination: {
          page: 1,
          pagePosition: 0
        },
        filter: {},
        sort: {}
      }
    },
    clear() {
      const stringifiedPageHistory = JSON.stringify({});
      window.sessionStorage.setItem('pageHistory', stringifiedPageHistory);
    }
  }
}
