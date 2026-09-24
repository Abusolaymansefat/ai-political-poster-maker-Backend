import { Template } from "./template.model";

export const getTemplates = async (
      occasionType?: string
) => {
      const filter: any = {
            isActive: true
      };

      if (occasionType) {
            filter.occasionType = occasionType;
      }

      return Template.find(filter)
            .sort({ createdAt: -1 })
            .toArray();
};

export const getTemplateById = async (
      id: string
) => {
      return Template.findById(id);
};