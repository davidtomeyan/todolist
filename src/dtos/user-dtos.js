export default function ({username,email,_id,id,isActivated}) {
    return{
        username,
        email,
        id:_id||id,
        isActivated
    }
}