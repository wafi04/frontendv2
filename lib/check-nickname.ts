import axios from "axios";
interface CheckNickname {
    game: string
    userId: number
    zone? : string
}
export  async function CheckNickname({ data }: { data: CheckNickname }) {
    let url = `/api/v1/nickname?game=${data.game}&userId=${data.userId}`
    if (data.zone) {
        url = `/api/v1/nickname?game=${data.game}&userId=${data.userId}&zone=${data.zone}`
    }
    const req = await axios.get(url, {
        headers: {
            "Api-Key" : `NAAKAAAVAHvafdCGFCWT7828728272`
        }
    })
    return req.data
}