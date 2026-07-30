"""Video generation, production, editing, and polishing resource for URI Social SDK.

Video Editing Billing PRD: produce_video, submagic_produce, and
zapcap_produce are billed at ceil(duration_seconds / 60) * credits_per_minute,
charged before the job is submitted for processing and refunded
automatically if the job later fails. Each of those three methods returns
a "billing" dict in its result so you can show the user what was charged.
"""

import json as _json
from typing import Dict, Any, List, Optional

from ..http_client import HTTPClient, UploadFile, normalize_upload_file


class VideoResource:
    """Video generation, production, editing, and polishing pipelines"""

    def __init__(self, http: HTTPClient):
        self._http = http

    # ── Billing ────────────────────────────────────────────────────────

    def get_pricing(self) -> Dict[str, Any]:
        """Current video-editing credit rate (credits per billable minute).

        The rate is admin-configurable server-side — fetch it instead of
        hard-coding it so your cost previews stay accurate.
        """
        response = self._http.get("/social-media/video-editing/pricing")
        return response["responseData"]

    def update_pricing(self, credits_per_minute: int) -> Dict[str, Any]:
        """Admin-only: change the live video-editing credit rate.

        Requires the caller's JWT email to be on the server's
        billing-admin allowlist.
        """
        response = self._http.patch(
            "/social-media/video-editing/pricing",
            json={"credits_per_minute": credits_per_minute},
        )
        return response["responseData"]

    # ── Video Production Pipeline (billed) ────────────────────────────

    def produce_video(
        self,
        video: Optional[UploadFile] = None,
        source_url: Optional[str] = None,
        video_type: str = "founder",
        template_id: str = "fast_founder",
        enable_music: bool = True,
        mute_original_audio: bool = False,
        enable_sfx: bool = True,
        enable_captions: bool = True,
        custom_music: Optional[UploadFile] = None,
        transition_style: str = "auto",
    ) -> Dict[str, Any]:
        """Start a full video production job — cuts, zooms, sound effects,
        captions, hook text — composed by AI and rendered with Shotstack.

        Provide either `video` (a file path, bytes, or open file object) or
        `source_url`, not both. Charged before submission; refunded
        automatically if the job fails. Poll get_production_job() for status.

        Returns: {"job_id": ..., "status": ..., "billing": {...}}
        """
        if video is None and not source_url:
            raise ValueError("Provide either video or source_url")

        files = []
        if video is not None:
            filename, content = normalize_upload_file(video, default_filename="video.mp4")
            files.append(("video", (filename, content)))
        if custom_music is not None:
            filename, content = normalize_upload_file(custom_music, default_filename="music.mp3")
            files.append(("custom_music", (filename, content)))

        data = {
            "video_type": video_type,
            "template_id": template_id,
            "enable_music": str(enable_music).lower(),
            "mute_original_audio": str(mute_original_audio).lower(),
            "enable_sfx": str(enable_sfx).lower(),
            "enable_captions": str(enable_captions).lower(),
            "transition_style": transition_style,
        }
        if source_url:
            data["source_url"] = source_url

        response = self._http.post_multipart("/social-media/produce-video", files=files, data=data)
        return response["responseData"]

    def get_production_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a produce-video job for status, progress, and output_url."""
        response = self._http.get(f"/social-media/produce-video-job/{job_id}")
        return response["responseData"]

    def capture_production_frame(self, job_id: str, at_seconds: float = 0.0) -> bytes:
        """Extract a JPEG frame at `at_seconds` from a completed production
        job's output video. Returns raw JPEG bytes."""
        return self._http.get_binary(
            f"/social-media/produce-video-job/{job_id}/capture-frame", params={"t": at_seconds}
        )

    def start_production_render(
        self, job_id: str, decisions: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Approve (optionally edited) AI decisions and start the final
        render. Call after get_production_job() returns "awaiting_review"."""
        response = self._http.post(
            f"/social-media/produce-video-job/{job_id}/start-render",
            json={"decisions": decisions} if decisions else {},
        )
        return response["responseData"]

    def adjust_production(
        self,
        job_id: str,
        caption_color: Optional[str] = None,
        caption_font: Optional[str] = None,
        caption_text_edits: Optional[List[Dict[str, Any]]] = None,
        hook_text: Optional[str] = None,
        hook_text_color: Optional[str] = None,
        hook_text_size: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Re-render a completed production video with light adjustments
        (caption color/font/text, hook text). Poll get_production_job()
        again for the updated output_url."""
        body: Dict[str, Any] = {}
        if caption_color is not None:
            body["caption_color"] = caption_color
        if caption_font is not None:
            body["caption_font"] = caption_font
        if caption_text_edits is not None:
            body["caption_text_edits"] = caption_text_edits
        if hook_text is not None:
            body["hook_text"] = hook_text
        if hook_text_color is not None:
            body["hook_text_color"] = hook_text_color
        if hook_text_size is not None:
            body["hook_text_size"] = hook_text_size

        response = self._http.post(f"/social-media/produce-video-job/{job_id}/adjust", json=body)
        return response["responseData"]

    # ── Submagic Pipeline (billed) ────────────────────────────────────

    def submagic_produce(
        self,
        video: UploadFile,
        template_name: str = "Sara",
        language: str = "en",
        remove_silence_pace: Optional[str] = None,
        magic_zooms: bool = False,
        magic_brolls: bool = False,
        clean_audio: bool = False,
        remove_bad_takes: bool = False,
        enable_music: bool = False,
        custom_music: Optional[UploadFile] = None,
    ) -> Dict[str, Any]:
        """Upload a video to Submagic for AI-powered captioning and editing
        (magic zooms, magic b-roll, silence removal, bad-take removal).
        Charged before submission; refunded automatically if the job fails.

        Returns: {"job_id": ..., "billing": {...}}
        """
        filename, content = normalize_upload_file(video, default_filename="video.mp4")
        files = [("video", (filename, content))]
        if enable_music and custom_music is not None:
            m_filename, m_content = normalize_upload_file(custom_music, default_filename="music.mp3")
            files.append(("custom_music", (m_filename, m_content)))

        data = {
            "template_name": template_name,
            "language": language,
            "magic_zooms": str(magic_zooms).lower(),
            "magic_brolls": str(magic_brolls).lower(),
            "clean_audio": str(clean_audio).lower(),
            "remove_bad_takes": str(remove_bad_takes).lower(),
            "enable_music": str(enable_music).lower(),
        }
        if remove_silence_pace:
            data["remove_silence_pace"] = remove_silence_pace

        response = self._http.post_multipart("/social-media/submagic-produce", files=files, data=data)
        return response["responseData"]

    def get_submagic_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a Submagic job for status and output_url."""
        response = self._http.get(f"/social-media/submagic-job/{job_id}")
        return response["responseData"]

    # ── ZapCap Pipeline (billed) ──────────────────────────────────────

    def list_zapcap_templates(self) -> List[Dict[str, Any]]:
        """List available ZapCap caption templates."""
        response = self._http.get("/social-media/zapcap-templates")
        return response["responseData"]["templates"]

    def zapcap_produce(
        self,
        video: Optional[UploadFile] = None,
        source_url: Optional[str] = None,
        template_id: str = "beast",
        language: str = "en",
        output_mode: str = "composited",
        quality: str = "standard",
        enable_broll: bool = False,
        enable_music: bool = False,
        caption_style: str = "bold",
        custom_music: Optional[UploadFile] = None,
        custom_broll_clips: Optional[List[UploadFile]] = None,
        custom_broll_placements: Optional[List[Dict[str, Any]]] = None,
        custom_broll_estimated_duration: float = 60.0,
    ) -> Dict[str, Any]:
        """Upload a video to ZapCap for AI captions, with optional b-roll
        and background music. Provide either `video` or `source_url`, not
        both. Charged before submission; refunded automatically if the job
        fails.

        `custom_broll_placements`, if given, is a list of
        {"clip_index": int, "start_time": float, "duration": float} dicts
        mapping each clip in custom_broll_clips to where it appears —
        omit to auto-spread clips evenly across custom_broll_estimated_duration.

        Returns: {"job_id": ..., "billing": {...}}
        """
        if video is None and not source_url:
            raise ValueError("Provide either video or source_url")

        files = []
        if video is not None:
            filename, content = normalize_upload_file(video, default_filename="video.mp4")
            files.append(("video", (filename, content)))
        if enable_music and custom_music is not None:
            m_filename, m_content = normalize_upload_file(custom_music, default_filename="music.mp3")
            files.append(("custom_music", (m_filename, m_content)))
        if custom_broll_clips:
            for i, clip in enumerate(custom_broll_clips):
                c_filename, c_content = normalize_upload_file(clip, default_filename=f"broll-{i}.mp4")
                files.append(("custom_broll_clips", (c_filename, c_content)))

        data = {
            "template_id": template_id,
            "language": language,
            "output_mode": output_mode,
            "quality": quality,
            "enable_broll": str(enable_broll).lower(),
            "enable_music": str(enable_music).lower(),
            "caption_style": caption_style,
            "custom_broll_estimated_duration": str(custom_broll_estimated_duration),
        }
        if source_url:
            data["source_url"] = source_url
        if custom_broll_placements:
            data["custom_broll_placements"] = _json.dumps(
                [
                    {
                        "clipIndex": p["clip_index"],
                        "startTime": p["start_time"],
                        "duration": p["duration"],
                    }
                    for p in custom_broll_placements
                ]
            )

        response = self._http.post_multipart("/social-media/zapcap-produce", files=files, data=data)
        return response["responseData"]

    def get_zapcap_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a ZapCap job for status and output_url."""
        response = self._http.get(f"/social-media/zapcap-job/{job_id}")
        return response["responseData"]

    def get_zapcap_transcript(self, job_id: str) -> List[Dict[str, Any]]:
        """Fetch the word-level transcript for a ZapCap job (for caption editing)."""
        response = self._http.get(f"/social-media/zapcap-job/{job_id}/transcript")
        return response["responseData"]["words"]

    def rerender_zapcap_job(
        self,
        job_id: str,
        word_edits: Optional[List[Dict[str, str]]] = None,
        template_id: Optional[str] = None,
        enable_broll: Optional[bool] = None,
        caption_style: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Re-render a ZapCap job with a different template, caption edits,
        or b-roll toggle. Returns a new job_id — poll it via
        get_zapcap_job(). This does not re-charge credits."""
        response = self._http.post(
            f"/social-media/zapcap-job/{job_id}/rerender",
            json={
                "word_edits": word_edits or [],
                "template_id": template_id,
                "enable_broll": enable_broll,
                "caption_style": caption_style,
            },
        )
        return response["responseData"]

    def zapcap_custom_broll(
        self,
        job_id: str,
        clips: List[UploadFile],
        placements: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Re-render a ZapCap job with your own b-roll clips at specific
        timestamps (uses ZapCap's native customBrolls API). Returns a new
        job_id — poll it via get_zapcap_job(). Does not re-charge credits.

        `placements` is a list of
        {"clip_index": int, "start_time": float, "end_time": float} dicts.
        """
        files = []
        for i, clip in enumerate(clips):
            filename, content = normalize_upload_file(clip, default_filename=f"broll-{i}.mp4")
            files.append(("clips", (filename, content)))

        response = self._http.post_multipart(
            f"/social-media/zapcap-job/{job_id}/custom-broll",
            files=files,
            data={"placements": _json.dumps(placements)},
        )
        return response["responseData"]

    # ── Video Editing — Level 1 FFmpeg pipeline (not billed) ──────────

    def edit_video(
        self,
        video: UploadFile,
        platform: str = "instagram_reels",
        enhancements: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Run the Level 1 FFmpeg editing pipeline on a raw upload — crop
        to 9:16, colour grade, trim, brand text overlays — and save the
        result as a reel draft. Poll get_edit_video_job() for status."""
        filename, content = normalize_upload_file(video, default_filename="video.mp4")
        response = self._http.post_multipart(
            "/social-media/edit-video",
            files=[("video", (filename, content))],
            data={
                "platform": platform,
                "enhancements": _json.dumps(enhancements) if enhancements else "{}",
            },
        )
        return response["responseData"]

    def get_edit_video_job(self, job_id: str) -> Dict[str, Any]:
        """Poll an edit-video job for status and output."""
        response = self._http.get(f"/social-media/edit-video-job/{job_id}")
        return response["responseData"]

    # ── Video Polish — Reap pipeline (not billed via VideoBillingService) ──

    def list_polish_styles(self) -> List[Dict[str, Any]]:
        """List available Video Polish style presets."""
        response = self._http.get("/social-media/video-polish-styles")
        return response["responseData"]

    def list_caption_presets(self) -> List[Dict[str, Any]]:
        """List caption style presets available for Video Polish."""
        response = self._http.get("/social-media/video-polish-caption-presets")
        return response["responseData"]

    def polish_video(
        self,
        video: UploadFile,
        style_preset: str = "clean_professional",
        language: str = "en-NG",
        captions_preset: str = "system_beasty",
    ) -> Dict[str, Any]:
        """Run the Video Polish clipping pipeline (ingest + quality check +
        Reap) on a raw upload. Poll get_polish_job() for status and clips."""
        filename, content = normalize_upload_file(video, default_filename="video.mp4")
        response = self._http.post_multipart(
            "/social-media/polish-video",
            files=[("video", (filename, content))],
            data={
                "style_preset": style_preset,
                "language": language,
                "captions_preset": captions_preset,
            },
        )
        return response["responseData"]

    def get_polish_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a Video Polish job for status and output clips."""
        response = self._http.get(f"/social-media/polish-video-job/{job_id}")
        return response["responseData"]

    def restyle_polish_video(
        self, original_job_id: str, new_style_preset: str, language: str = "en-NG"
    ) -> Dict[str, Any]:
        """Re-polish an already-processed video with a different style
        preset, reusing the same source video (no re-upload)."""
        response = self._http.post_multipart(
            "/social-media/polish-video-restyle",
            data={
                "original_job_id": original_job_id,
                "new_style_preset": new_style_preset,
                "language": language,
            },
        )
        return response["responseData"]

    def apply_clip_action(
        self,
        job_id: str,
        clip_idx: int,
        action: str,
        orientation: str = "landscape",
        source_language: str = "en",
        target_language: str = "es",
    ) -> Dict[str, Any]:
        """Trigger a secondary action ("reframe" or "dub") on a specific
        Video Polish clip. Long-running — poll get_clip_action_status()
        for the result."""
        response = self._http.post_multipart(
            "/social-media/polish-video-clip-action",
            data={
                "job_id": job_id,
                "clip_idx": str(clip_idx),
                "action": action,
                "orientation": orientation,
                "source_language": source_language,
                "target_language": target_language,
            },
        )
        return response["responseData"]

    def get_clip_action_status(self, action_job_id: str) -> Dict[str, Any]:
        """Poll a clip action (reframe/dub) job by its action_job_id."""
        response = self._http.get(f"/social-media/polish-video-clip-action/{action_job_id}")
        return response["responseData"]

    # ── AI Storyboard + Veo Generation Pipeline ───────────────────────

    def generate_storyboard(
        self,
        brand_images: List[str],
        optional_text: Optional[str] = None,
        target_platform: str = "instagram_reels",
        target_duration_seconds: int = 15,
        video_style: Optional[str] = "clean_commercial",
    ) -> Dict[str, Any]:
        """Generate a GPT-4o Vision video storyboard from 1-5 brand images."""
        response = self._http.post(
            "/social-media/generate-storyboard",
            json={
                "brand_images": brand_images,
                "optional_text": optional_text,
                "target_platform": target_platform,
                "target_duration_seconds": target_duration_seconds,
                "video_style": video_style,
            },
        )
        return response["responseData"]

    def generate_video_from_storyboard(
        self,
        storyboard: Dict[str, Any],
        brand_images: Optional[List[str]] = None,
        model: str = "veo-3.1-generate-preview",
    ) -> Dict[str, Any]:
        """Start Veo 3.1 video generation for every scene in a storyboard.
        Poll get_video_job() for progress; clips arrive incrementally."""
        response = self._http.post(
            "/social-media/generate-video-from-storyboard",
            json={"storyboard": storyboard, "brand_images": brand_images or [], "model": model},
        )
        return response["responseData"]

    def get_video_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a Veo video-generation job. clips grows as each scene finishes."""
        response = self._http.get(f"/social-media/video-job/{job_id}")
        return response["responseData"]

    def generate_storyboard_frames(
        self, scenes: List[Dict[str, Any]], brand_images: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate a preview frame image for each storyboard scene."""
        response = self._http.post(
            "/social-media/generate-storyboard-frames",
            json={"scenes": scenes, "brand_images": brand_images or []},
        )
        return response["responseData"]

    def get_storyboard_frame_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a storyboard frame-generation job."""
        response = self._http.get(f"/social-media/storyboard-frame-job/{job_id}")
        return response["responseData"]

    def merge_video_job(self, job_id: str) -> Dict[str, Any]:
        """Merge all completed clips from a finished Veo job into one video."""
        response = self._http.post(f"/social-media/merge-video-job/{job_id}")
        return response["responseData"]

    def generate_video_caption(
        self, storyboard: Dict[str, Any], platform: str = "instagram"
    ) -> Dict[str, Any]:
        """Generate a platform-optimised caption for a merged storyboard video."""
        response = self._http.post(
            "/social-media/generate-video-caption",
            json={"storyboard": storyboard, "platform": platform},
        )
        return response["responseData"]

    # ── Video Drafts & Publishing ─────────────────────────────────────

    def save_video_draft(
        self, merged_video_url: str, caption: str = "", platforms: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Save a merged video as a draft for later posting (one per platform)."""
        response = self._http.post(
            "/social-media/video-drafts",
            json={
                "merged_video_url": merged_video_url,
                "caption": caption,
                "platforms": platforms or [],
            },
        )
        return response["responseData"]

    def list_video_drafts(self) -> List[Dict[str, Any]]:
        """List saved video drafts for the current user."""
        response = self._http.get("/social-media/video-drafts")
        return response["responseData"]

    def publish_video_draft(
        self, draft_id: str, platform: str, caption: Optional[str] = None
    ) -> Dict[str, Any]:
        """Publish a saved video draft to Instagram Reels, Facebook, or
        TikTok. Poll get_video_publish_job() for status."""
        response = self._http.post(
            "/social-media/publish-video-draft",
            json={"draft_id": draft_id, "platform": platform, "caption": caption},
        )
        return response["responseData"]

    def get_video_publish_job(self, job_id: str) -> Dict[str, Any]:
        """Poll a video publish job for status."""
        response = self._http.get(f"/social-media/video-publish-job/{job_id}")
        return response["responseData"]
