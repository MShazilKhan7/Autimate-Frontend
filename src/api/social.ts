import api from "@/utils/api";

export interface SocialSkill {
  _id?: string;
  task: string;
  image: string;
  description: string;
  instruction: string;
  category: string;
}

export const socialAPI = {
  getAll: () => api.get("/api/social-skills").then(res => res.data),
};
