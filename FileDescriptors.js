/*
  type: ["Image","String","Longtext","List","Number"]
*/




let arr = [{
  name: "Conference",
  type: "List",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "Year",
  type: "Number",
  bucketName: [100, 200, 300],
  histogram: [20, 40],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "Title",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "DOI",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "Link",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "FirstPage",
  type: "Number",
  bucketName: [100, 200, 300],
  histogram: [20, 40],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "LastPage",
  type: "Number",
  bucketName: [100, 200, 250, 400],
  histogram: [20, 40, 100],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "PaperType",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "Abstract",
  type: "Longtext",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "AuthorNames-Deduped",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "AuthorNames",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "AuthorAffiliation",
  type: "Longtext",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "InternalReferences",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "AuthorKeywords",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "AminerCitationCount_02-2019",
  type: "Number",
  bucketName: [100, 200, 300],
  histogram: [20, 40],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "XPloreCitationCount_02-2019",
  type: "Number",
  bucketName: [100, 200, 300],
  histogram: [20, 40],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "PubsCited",
  type: "Number",
  bucketName: [100, 200, 300],
  histogram: [20, 40],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "Award",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
}, {
  name: "image_file",
  type: "String",
  bucketName: ["A", "B", "C"],
  histogram: [100, 200, 300],
  comparator: function (a, b) {
    return 1;
  },
  indices: function (value) {
    return 1;
  }
},
];

export default (function () {
  return arr;
})();
