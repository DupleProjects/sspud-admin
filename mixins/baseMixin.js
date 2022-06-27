export default {
  methods: {
    getObjectsWhereKeysHaveValues(array, properties, returnOne) {
      // Underscore where functionality
      // eg properties = {"id": 1, "name": 'some name'}
      // Returns an array of all the values that contain all of key-value pairs listed in properties.
      let matchingObjectsArray = [];
      for (let i = 0; i < array.length; i++) {
        let allKeyValuesMatch = true;
        for (const key in properties) {
          if (array[i][key] !== properties[key]) {
            allKeyValuesMatch = false;
          }
        }
        if (allKeyValuesMatch === true) {
          matchingObjectsArray.push(array[i]);
        }
      }
      if (matchingObjectsArray.length > 0 && returnOne) {
        matchingObjectsArray = matchingObjectsArray[0];
      }
      if (matchingObjectsArray.length === 0 && returnOne) {
        return null;
      }

      return matchingObjectsArray;
    },
    getPropertyValuesFromArray(array, property) {
      // Underscore pluck functionality
      // Extracts a list of property values from array
      if (array === null || array === undefined || array.length === 0) {
        return [];
      }
      const allPropertyValues = [];
      for (let i = 0; i < array.length; i++) {
        allPropertyValues.push(array[i][property]);
      }
      return allPropertyValues;
    },
    getObjectsWherePropertyHasValues(array, property, values) {
      // function onlyUnique(value, index, self) {
      //   return self.indexOf(value) === index;
      // }
      // values = values.filter(onlyUnique);
      const filteredArray = [];
      values.forEach(function(value) {
        array.forEach(function(entry) {
          if (entry[property] === value) {
            filteredArray.push(entry);
          }
        });
      });
      return filteredArray;
    },
    formatDateTime(date, justDate) {
      const dt = new Date(date);
      const iso = `${dt
        .getFullYear()
        .toString()
        .padStart(
          4,
          "0"
        )}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`
      const dateTime = `${dt
        .getFullYear()
        .toString()
        .padStart(
          4,
          "0"
        )}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`
      return justDate? dateTime : iso;
    },
    clone(obj) {
      var copy = JSON.parse(JSON.stringify(obj));
      // Handle the 3 simple types, and null or undefined
      // if (null == obj || "object" != typeof obj) return obj;
      // // Handle Date
      // if (obj instanceof Date) {
      //   copy = new Date();
      //   copy.setTime(obj.getTime());
      //   return copy;
      // }
      // // Handle Array
      // if (obj instanceof Array) {
      //   copy = [];
      //   for (var i = 0, len = obj.length; i < len; i++) {
      //     copy[i] = this.clone(obj[i]);
      //   }
      //   return copy;
      // }
      // // Handle Object
      // if (obj instanceof Object) {
      //   copy = {};
      //   for (var attr in obj) {
      //     if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
      //   }
      //   return copy;
      // }
      return copy
      throw new Error("Unable to copy obj! Its type isn't supported.");
    }
  }
}
