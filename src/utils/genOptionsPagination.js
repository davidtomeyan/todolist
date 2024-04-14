export default function ({page, per_page}){
    return {
        lean:true,
        allowDiskUse : true ,
        sort: { date:1},
        page:page,
        limit:per_page,
        collation: { locale: 'ru'}
    }
}