ALTER TABLE `brief` ADD `gemini_video_uri` text;--> statement-breakpoint
ALTER TABLE `brief` ADD `model` enum('gemini-2.0-flash','twelvelabs-pegasus') NOT NULL;--> statement-breakpoint
ALTER TABLE `brief` ADD `prompt` text NOT NULL;