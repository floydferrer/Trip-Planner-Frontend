import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class TripPlannerApi {
  // the token for interactive with the API will be stored here.
  static token;
  

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${data.token}`};
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Register user */

  static async registerUser(user) {
    let res = await this.request(`auth/register`, user, 'post');
    return res;
  }

  /** Login user */

  static async loginUser(user) {
    let res = await this.request(`auth/token`, user, 'post');
    return res;
  }

  /** Get user */
  static async getCurrUser(user, token){
    let res = await this.request(`users/${user}`, token);
    return res.user;
  }

  /** Get user trips*/
  static async getTrips(user, token){
    let res = await this.request(`trips/${user}`, token);
    return res;
  }

  /** Add new trip */

  static async addTrip(username, tripInfo, token) {
    let res = await this.request(`trips`, {tripInfo, token, username}, 'post');
    return res;
    }

  /** Delete trip */
  static async deleteTrip(tripId, token){
    let res = await this.request(`trips/${tripId}`, {token}, 'delete');
    return res.deleted;
  }
}

export default TripPlannerApi