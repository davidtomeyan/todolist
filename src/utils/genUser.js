import bcrypt from "bcrypt";

export default async function (user) {
   return await bcrypt.hash(user.password, 5).then(
        (hash)=>( {
            ...user,
            password:hash,
            prefix:parseInt(user.prefix),
            phone:parseInt(user.phone)
        })
    )
}