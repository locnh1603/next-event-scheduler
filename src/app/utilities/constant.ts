export default class URLConstants {
  private static readonly BASE_URL = process.env.API_URL;
  public static readonly Events = URLConstants.BASE_URL + "/events";
}
