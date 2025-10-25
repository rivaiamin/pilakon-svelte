<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { supabase, assets as assetHelpers } from '$lib/supabase';
  import { Upload, X, Image, File as FileIcon, AlertCircle } from 'lucide-svelte';
  import type { Asset } from '$lib/types';

  const dispatch = createEventDispatcher<{
    upload: { asset: Asset };
    error: { message: string };
  }>();

  let isUploading = false;
  let dragActive = false;
  let selectedFiles: File[] = [];
  let error = '';
  let progress = 0;

  // File validation
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  function validateFile(file: File): string | null {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use PNG, JPG, WebP, or SVG.`;
    }
    if (file.size > maxFileSize) {
      return `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds the 10MB limit.`;
    }
    return null;
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      error = errors.join('\n');
    }

    selectedFiles = [...selectedFiles, ...validFiles];
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragActive = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragActive = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragActive = false;
    const files = event.dataTransfer?.files;
    if (files) {
      handleFiles(files);
    }
  }

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    handleFiles(target.files);
  }

  function removeFile(index: number) {
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
  }

  async function uploadFiles() {
    if (selectedFiles.length === 0) return;

    isUploading = true;
    error = '';
    progress = 0;

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        // Upload via server-side API endpoint
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to upload ${file.name}: ${errorData.error}`);
        }

        const result = await response.json();
        progress = ((index + 1) / selectedFiles.length) * 100;
        return result.asset;
      });

      const uploadedAssets = await Promise.all(uploadPromises);
      
      // Dispatch success event for each uploaded asset
      uploadedAssets.forEach(asset => {
        dispatch('upload', { asset });
      });

      // Reset form
      selectedFiles = [];
      progress = 0;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Upload failed';
    } finally {
      isUploading = false;
    }
  }

  function getFileIcon(type: string) {
    if (type.startsWith('image/')) return Image;
    return FileIcon;
  }
</script>

<div class="asset-upload">
  <div 
    class="upload-area"
    class:drag-active={dragActive}
    class:uploading={isUploading}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >
    <div class="upload-content">
      <Upload class="upload-icon" size={48} />
      <h3 class="upload-title">
        {#if isUploading}
          Uploading Assets...
        {:else if selectedFiles.length > 0}
          {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected
        {:else}
          Drop files here or click to browse
        {/if}
      </h3>
      <p class="upload-subtitle">
        {#if isUploading}
          Please wait while your files are uploaded
        {:else}
          Supports PNG, JPG, WebP, SVG up to 10MB each
        {/if}
      </p>
      
      {#if isUploading}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress}%"></div>
        </div>
      {/if}
    </div>

    <input
      type="file"
      multiple
      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
      on:change={handleFileInput}
      class="file-input"
      disabled={isUploading}
    />
  </div>

  {#if selectedFiles.length > 0}
    <div class="selected-files">
      <h4 class="files-title">Selected Files</h4>
      <div class="files-list">
        {#each selectedFiles as file, index}
          <div class="file-item">
            <div class="file-info">
              <svelte:component this={getFileIcon(file.type)} class="file-icon" size={20} />
              <div class="file-details">
                <span class="file-name">{file.name}</span>
                <span class="file-size">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            </div>
            <button 
              class="remove-btn"
              on:click={() => removeFile(index)}
              disabled={isUploading}
            >
              <X size={16} />
            </button>
          </div>
        {/each}
      </div>
      
      <div class="upload-actions">
        <button 
          class="upload-btn"
          on:click={uploadFiles}
          disabled={isUploading}
        >
          {#if isUploading}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          {:else}
            Upload {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'}
          {/if}
        </button>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="error-message">
      <AlertCircle class="error-icon" size={16} />
      <span>{error}</span>
    </div>
  {/if}
</div>

<style>
  .asset-upload {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    background: #f9fafb;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
  }

  .upload-area:hover {
    border-color: #667eea;
    background: #f3f4f6;
  }

  .upload-area.drag-active {
    border-color: #667eea;
    background: #eef2ff;
  }

  .upload-area.uploading {
    border-color: #10b981;
    background: #ecfdf5;
    cursor: not-allowed;
  }

  .upload-content {
    pointer-events: none;
  }

  .upload-icon {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .upload-area.drag-active .upload-icon,
  .upload-area:hover .upload-icon {
    color: #667eea;
  }

  .upload-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  .upload-subtitle {
    color: #6b7280;
    margin: 0;
    font-size: 0.875rem;
  }

  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .progress-bar {
    width: 100%;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 0.25rem;
    overflow: hidden;
    margin-top: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: #10b981;
    transition: width 0.3s ease;
  }

  .selected-files {
    margin-top: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .files-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
  }

  .files-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .file-icon {
    color: #6b7280;
  }

  .file-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .file-name {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .file-size {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .remove-btn {
    padding: 0.5rem;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .remove-btn:hover {
    background: #fecaca;
  }

  .remove-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-actions {
    display: flex;
    justify-content: flex-end;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .upload-btn:hover:not(:disabled) {
    background: #5a67d8;
  }

  .upload-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #dc2626;
    margin-top: 1rem;
    font-size: 0.875rem;
  }

  .error-icon {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .upload-area {
      padding: 1.5rem;
    }

    .upload-title {
      font-size: 1.125rem;
    }

    .file-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .file-info {
      width: 100%;
    }

    .remove-btn {
      align-self: flex-end;
    }
  }
</style>
