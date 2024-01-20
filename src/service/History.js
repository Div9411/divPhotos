import supabase from "./supabase";

async function readAll(sessionId) {
  let { data: history, error } = await supabase.from("history").select("*");

  if (error) throw new Error(error.message);

  const arr = history.filter((element, index) => element.userId == sessionId);
  return arr;
}

async function addRow(sessionId, downloadUrl) {
  const { data, error } = await supabase
    .from("history")
    .insert([{ userId: sessionId, imageLink: downloadUrl }])
    .select();

  if (error) throw new Error(error.message);
}

export { readAll, addRow };
