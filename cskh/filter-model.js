export const matchesAny=(selection,value)=>{const list=Array.isArray(selection)?selection:selection?[selection]:[];return !list.length||list.includes(value);};
