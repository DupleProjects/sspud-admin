import axios from "axios";

export const entityDataStore = {
  getters: {},

  mutations: {},
  actions: {
    async dataGate({ commit }, data) {
      const body = data;
      console.log("dataGate " + data.tableName + " request data", data);
      const response = await axios({
        method: "post",
        url: process.env.apiURL + "/dataGate",
        headers: {},
        data: body,
      });
      console.log(data.tableName + " response", response);
      // We know what will be returned so can do all this stuff here
      if (data.operation === "read") {
        if (response.data) {
          return response.data;
        } else {
          console.log("Empty Response!");
          return {
            data: [],
            count: 0,
          };
        }
      }

      return response.data;
    },
    async callMiddlewareRoute({ commit }, data) {
      console.log("data.route", data);
      if (data.hasOwnProperty("route")) {
        const response = await axios({
          method: "post",
          url: process.env.apiURL + "/" + data.route,
          headers: {},
          data: data,
        });
        return response.data;
      }
      return {
        success: false,
        message: "No route provided",
      };
    },
  },
};
