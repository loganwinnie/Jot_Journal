const BASE_URL =  "http://localhost:8000";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JournalAPI {
  // DON'T MODIFY THIS TOKEN
  static token: string | null = "";

  static async request(
    endpoint: string, 
    data = {}, 
    method = "GET", 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any = undefined,
    contentType:string = "application/json",
    ) {
    const url = new URL(`${ BASE_URL }/${ endpoint }`);
    const headers = {
      authorization: `Bearer ${ this.token }`,
      'content-type': contentType,
    };
    
    url.search = (method === "GET")
    ? new URLSearchParams(data).toString()
    : "";

    if( contentType === "multipart/form-data" && typeof body !== "string") {
        const formData = new FormData();
        for ( const key in body! ) {
          if(key !== "images") {
            formData.append(key, body[key]!);
          } else {
            for (const file of body[key]) {
              formData.append(file.name, file)
            }
          }
        }
    }
    // set to undefined since the body property cannot exist on a GET method
    if (method !== "GET" && contentType === "multipart/form-data"){
        body = JSON.stringify(data)
    }

    const resp = await fetch(url, { method, body, headers });

    if (!resp.ok) {
        await this.handleAPIError(resp)
    }

    return await resp.json();
  }

  //fetch API does not throw an error, have to dig into the resp for msgs
  static async handleAPIError(resp: Response) {
    console.error("API Error:", resp.statusText, resp.status);
      const { error } = await resp.json();
      if (Array.isArray(error)) {
        throw error;
      }
      else {
        throw [error.message];
      }
  }

  // Auth API routes
  
  /**Takes user data from signup form calls api to register the user, returns
   * response*/
  static async signup(userData:  {
        password: string,
        firstName: string,
        lastName: string,
        username: string
    }) {
    const res = await this.request('auth/register', userData, "POST");
    return res;
  }
  
  /**Takes email and password from login form and signs in the user via API call 
   * email labeled username because oauth formatting
  */
  static async login(userData: {username: string, password: string}) {
    const res = await this.request('auth/login',userData, "POST", undefined , "multipart/form-data");
    return res;
  }


  // User API routes

  /** Get a user from token.  */
  static async getUserFromToken() {
    const res = await this.request('users');
    return res;
  }

  /** Delete a user.  */
  static async deleteUser() {
    const res = await this.request(`users`, undefined, "DELETE");
    return res;
  }

  // Entries API routes

  /** Create new entry for user  */
  static async createEntry(entryData: {content: string}) {
    const res = await this.request("entries", undefined, "POST", entryData);
    return res;
  }

  /**Get user's Entry */
  static async getUserEntry(entryId:string) {
    const data = {entry_id: entryId}
    const res = await this.request("entries", data);
    return res;
  }
    
  /**Get user's Entries */
  static async getUserEntries() {
    const res = await this.request("entries");
    return res;
  }

  /**Delete user's Entries */
  static async deleteUserEntry(entryId:string) {
    const data = {entry_id: entryId}
    const res = await this.request("entries", data, "DELETE");
    return res;
  }

  static async patchUserEntry(entryId:string,entryData: {content: string}) {
    const data = {entry_id: entryId}
    const res = await this.request("entries", data, "POST", entryData);
    return res;
    }

  // Prompt API routes
  static async getPrompt(content: string) {
    const res = await this.request("prompts", undefined, "POST", {prompt: content});
    return res;
  }

}

export default JournalAPI;