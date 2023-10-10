class ConversionError extends Error {
  constructor(type, filePath) {
    super();
    this.conversionType = type;
    this.filePath = filePath;
  }
}

module.exports = ConversionError;
