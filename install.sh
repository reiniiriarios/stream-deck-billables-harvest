if [ -n "$WINDIR" ]; then
  # @todo test on win
  printf "Copying plugin build to \"%appdata%\\Elgato\\StreamDeck\\Plugins\\me.reinii.harvest-billables.sdPlugin\"\n"
  cp -R ./build/me.reinii.harvest-billables.sdPlugin "%appdata%\\Elgato\\StreamDeck\\Plugins\\me.reinii.harvest-billables.sdPlugin"
else
  printf "Copying plugin build to \"~/Library/Application Support/com.elgato.StreamDeck/Plugins/me.reinii.harvest-billables.sdPlugin\"\n"
  cp -R ./build/me.reinii.harvest-billables.sdPlugin ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/
fi
