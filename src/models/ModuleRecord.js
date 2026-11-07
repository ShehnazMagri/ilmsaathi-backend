import mongoose from 'mongoose';

// Stores records for the ERP modules that do not need a dedicated schema yet.
// Keeping the module name indexed lets each UI table be queried independently.
const moduleRecordSchema = new mongoose.Schema(
  {
    module: { type: String, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

moduleRecordSchema.index({ module: 1, deleted: 1 });

export const ModuleRecord =
  mongoose.models.ModuleRecord || mongoose.model('ModuleRecord', moduleRecordSchema);
