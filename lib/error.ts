class AppError extends Error{
    constructor(message:string,public status:number,options?:{cause?:string}){
        super(message,options)
        this.name="APP_ERROR"
    }
}
export default AppError