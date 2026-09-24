import type { Request, Response } from "express";
import {
      getTemplateById,
      getTemplates
} from "./template.service";

export const getAllTemplates = async (
      req: Request,
      res: Response
) => {
      try {
            const occasionType =
                  req.query.occasionType as string | undefined;

            const templates =
                  await getTemplates(occasionType);

            res.json({
                  success: true,
                  data: templates
            });
      } catch (error: any) {
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};

export const getSingleTemplate = async (
      req: Request,
      res: Response
) => {
      try {
            const templateId = req.params.id;

            if (typeof templateId !== "string") {
                  return res.status(400).json({
                        success: false,
                        message: "Invalid template id"
                  });
            }

            const template =
                  await getTemplateById(templateId);

            if (!template) {
                  return res.status(404).json({
                        success: false,
                        message: "Template not found"
                  });
            }

            res.json({
                  success: true,
                  data: template
            });
      } catch (error: any) {
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};