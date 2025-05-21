# apps/events/management/commands/load_predefined_images.py - Fixed version

import os
from django.core.management.base import BaseCommand
from django.core.files.images import ImageFile
from django.conf import settings
from apps.events.models import PredefinedImage

class Command(BaseCommand):
    help = 'Load predefined images from directories based on type'

    def add_arguments(self, parser):
        parser.add_argument(
            '--base-dir',
            dest='base_dir',
            default='predefined_images',
            help='Base directory with images (relative to MEDIA_ROOT)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            dest='dry_run',
            default=False,
            help='Dry run - do not actually import images',
        )

    def handle(self, *args, **options):
        base_dir = options['base_dir']
        dry_run = options['dry_run']
        
        # Base directory path
        base_dir_path = os.path.join(settings.MEDIA_ROOT, base_dir)
        
        # Define subdirectories for each image type
        subdirs = {
            'events': 'event',
            'categories': 'category',
            'items': 'item',
            'general': 'all'
        }
        
        # Check if base directory exists
        if not os.path.exists(base_dir_path):
            self.stdout.write(self.style.WARNING(f'Creating base directory: {base_dir_path}'))
            os.makedirs(base_dir_path, exist_ok=True)
        
        # Create subdirectories
        for subdir in subdirs.keys():
            subdir_path = os.path.join(base_dir_path, subdir)
            if not os.path.exists(subdir_path):
                os.makedirs(subdir_path, exist_ok=True)
                self.stdout.write(
                    self.style.WARNING(
                        f'Created subdirectory: {subdir_path}'
                    )
                )
            else:
                self.stdout.write(f'Subdirectory already exists: {subdir_path}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Directory structure created/verified in {base_dir_path}.'
            )
        )
        self.stdout.write(
            self.style.NOTICE(
                f'Add images to the appropriate subdirectories and run this command again to import them.'
            )
        )
        
        # Supported image extensions
        supported_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        # Count processed images
        created_count = 0
        skipped_count = 0
        
        # Process each subdirectory
        for subdir, image_type in subdirs.items():
            subdir_path = os.path.join(base_dir_path, subdir)
            
            # Skip if directory doesn't exist (should never happen now)
            if not os.path.exists(subdir_path):
                continue
            
            # Check if directory is empty
            if not os.listdir(subdir_path):
                self.stdout.write(f'No images found in {subdir_path}')
                continue
            
            self.stdout.write(
                self.style.NOTICE(
                    f'Processing {image_type} images from {subdir_path}...'
                )
            )
            
            # Process each file in the subdirectory
            for filename in os.listdir(subdir_path):
                # Skip if not a file
                file_path = os.path.join(subdir_path, filename)
                if not os.path.isfile(file_path):
                    continue
                
                # Check if the file is an image
                name, ext = os.path.splitext(filename)
                if ext.lower() not in supported_extensions:
                    continue
                
                # Generate a nice name from the filename
                nice_name = name.replace('_', ' ').replace('-', ' ').title()
                
                # Check if this image already exists
                if PredefinedImage.objects.filter(name=nice_name, image_type=image_type).exists():
                    self.stdout.write(f'Skipping existing image: {nice_name} (type: {image_type})')
                    skipped_count += 1
                    continue
                
                # Create the PredefinedImage object
                if not dry_run:
                    with open(file_path, 'rb') as f:
                        image_file = ImageFile(f)
                        predefined_image = PredefinedImage(
                            name=nice_name,
                            image_type=image_type
                        )
                        # The upload_to function will handle the path correctly
                        predefined_image.image.save(filename, image_file)
                
                created_count += 1
                self.stdout.write(f'{"Would create" if dry_run else "Created"} predefined image: {nice_name} (type: {image_type})')
        
        # Summary message
        if created_count == 0 and skipped_count == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Directory structure ready. No images found to import.'
                )
            )
        elif dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Dry run completed. Would import {created_count} predefined images (would skip {skipped_count} existing images)'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully imported {created_count} predefined images (skipped {skipped_count} existing images)'
                )
            )
        
        # Instructions for adding to admin
        if created_count > 0 and not dry_run:
            self.stdout.write(
                self.style.NOTICE(
                    'You can now view and manage these images in the admin interface at /admin/events/predefinedimage/'
                )
            )