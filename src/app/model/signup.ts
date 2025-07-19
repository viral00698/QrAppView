export class Signup {
    private email!: string;
    private password!: string;
    private name!: string;
    private role!: any;
    private vid:string;
    private uid?:string



    constructor(email: any, password: any, name: any, role: any , vid:string , uid:string) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.vid = vid;
        this.uid = uid

    }

    getEmail(): any {
        return this.email;
    }

    getPassword(): any {
        return this.password;
    }

    getName(): any {
        return this.name;
    }

    getRole(): any {
        return this.role;
    }

    setEmail(email: any): void {
        this.email = email;
    }

    setPassword(password: any): void {
        this.password = password;
    }

    setName(name: any): void {
        this.name = name;
    }

    setRole(role: any): void {
        this.role = role;
    }

}
