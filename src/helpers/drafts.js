export const getLastStep = (parsed, steps) => {
  let stepCount = 0;

  steps.forEach((step, index) => {
    if (step.fields) {
      step.fields.forEach((field) => {
        if (field.modelKey) {
          // If it is an array and has a value of more than 0 or if it isn't an array and does not === null.
          if (Array.isArray(parsed.model[field.modelKey]) && parsed.model[field.modelKey].length > 0) {
            stepCount = index;
          } else if (parsed.model[field.modelKey] !== null && parsed.model[field.modelKey] !== undefined && !Array.isArray(parsed.model[field.modelKey])) {
            stepCount = index;
          }
        }
      });
    } else if (step.model) {
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(parsed.childModels[step.model])) {
          if (value !== null && value !== undefined && key !== 'listCount') {
            stepCount = index;
          }
        }
    }
  });

  return stepCount;
}

const validImageUploads = ["png", "jpg", "jpeg", "gif"];
const validVideoUploads = ["mov", "3gp", "mp4"];

export const getDraftUploadErrors = (draft) => {
  const errors = [];
  // Check cover photo
  if (draft.data.pitch.cover_photo) {
    const coverSplit = draft.data.pitch.cover_photo.split(".");
    const coverLast = coverSplit.pop();
    if (!validImageUploads.includes(coverLast.toLowerCase())) {
      errors.push({
        code: "WRONG_FORMAT",
        source: "cover_photo"
      })
    }
  }

  // Check Video
  if (draft.data.pitch.video) {
    const videoSplit = draft.data.pitch.video.split(".");
    const videoLast = videoSplit.pop();
    if (!validVideoUploads.includes(videoLast.toLowerCase())) {
      errors.push({
        code: "WRONG_FORMAT",
        source: "video"
      })
    }
  }

  return errors;
};