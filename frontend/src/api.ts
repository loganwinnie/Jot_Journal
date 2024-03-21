import LoginForm from "./Authentication/Login";

const BASE_URL =  "http://localhost:3001";
/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class PlusOneApi {
  // DON'T MODIFY THIS TOKEN
  static token = "";

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
  // User API routes
  
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
    const res = await this.request('auth/login',userData, "POST", "multipart/form-data");
    return res;
  }
  
  /**Takes user data from profile form calls api to update the user's profile, returns
   * response
    */   
    static async updateProfile(userData: InitialProfile, email:string) {
      const formData = new FormData();

      for ( const key in userData ) {
        if(key !== "images") {
          formData.append(key, userData[key]);
        } else {
          for (const file of userData[key]!) {
            formData.append(file.name, file)
          }
        }
      }

        const resp = await fetch(`${ BASE_URL }/profiles/${ email }`, {
        method: 'PATCH',
        body: formData,
        headers: {
          "Authorization": `Bearer ${ this.token }`,
        }
      });
      if (!resp.ok) {
        await this.handleAPIError(resp)
    } 
    return await resp.json();
  }


  // Events API routes

  /** Create new event  */
  static async createEvent(eventData: CreateOrEditEvent) {
    const formData = new FormData();

      for ( const key in eventData ) 
        if(key !== "images") {
            formData.append(key, eventData[key]);
          } else {
          for (const file of eventData[key]!) {
            formData.append(file.name, file)
          }
      }

        const resp = await fetch(`${ BASE_URL }/events`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${ this.token }`,
        }
      });
      if (!resp.ok) {
        await this.handleAPIError(resp)

    } 
    return await resp.json();
    }

  /**Get Events, accepts range,min,max */
  static async getEvents(params: EventsParams) {

    const res = params
    ? await this.request('events', params)
    : await this.request('events');
  
    return res.events;
  }
  
  /** Get details on a event. */
  static async getEvent(id:string) {
    const res = await this.request(`events/${ id }`);
    return res;
  }
  
  /** Get delete a event. */
  static async deleteEvent(eventId:string) {
    const res = await this.request(`events/${ eventId }`, undefined, "DELETE");
    return res;
  }

  // Likes API routes

  /** Create a like. */
  static async postLike(param:string, body?: {eventId: string}) {
    if(body) {
      const res = await this.request(`likes/${ param }`, body, "POST");
      return res
    }else {
      const res = await this.request(`likes/${ param }`, body, "POST");
      return res
    }
  }

  /** get likes for user. */
  static async getLikes() {
    const res = await this.request("likes")
    return res.likes;
  }

  // Likes API routes

  /** Get all chats for user. */
  static async getChats(): Promise<Chat[]> {
    const res = await this.request('chats');
    return res.chats;
  }

    /** Gets singular chat for user. */
  static async getChat(id: string): Promise<Chat> {
    const res = await this.request(`chats/${ id }`);
    return res.chat;
  }
}

export default PlusOneApi;