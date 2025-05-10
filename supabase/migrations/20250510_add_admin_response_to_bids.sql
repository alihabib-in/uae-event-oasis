
-- Add admin_response column to bids table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bids' 
    AND column_name = 'admin_response'
  ) THEN
    ALTER TABLE public.bids ADD COLUMN admin_response text;
  END IF;
END $$;
