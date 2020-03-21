const { DataSource } = require('apollo-datasource');

const locale = "en-US";

class HomeAPI extends DataSource {

  initialize(config) {
    this.context = config.context;
  }

  async getHome() {
    return await this.context.deliveryClient
      .getEntry(this.context.home_entry_id)
      .then(entry => entry.fields);
  }

  async updateName(object) {
    return await this.context.managementClient.getSpace(this.context.space_id)
      .then(space => space.getEnvironment(this.context.environment_id))
      .then(environment => environment.getEntry(this.context.home_entry_id))
      .then(entry => {
        entry.fields.name[locale] = object.name;
        return entry.update();
      })
      .then(entry => {
        let success = entry.fields.name[locale] == object.name;
        return { success, fields: HomeAPI.removeLocale(entry.fields) };
      });
  }

  static addLocale(object) {
    let keys = Object.keys(object);
    let newObject = {};
    for (let key in keys) {
      newObject[key][locale] = object[key];
    }
    return newObject;
  }

  static removeLocale(object) {
    let keys = Object.keys(object);
    let newObject = {};
    for (let key of keys) {
      newObject[key] = object[key][locale];
    }
    return newObject;
  }

}

module.exports = HomeAPI;
