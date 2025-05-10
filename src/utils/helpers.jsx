export const getUserName = (name) => {
  if (!name || typeof name !== "string") return "@unknown";
  return "@" + name.trim().toLowerCase().replaceAll(" ", "_");
};
