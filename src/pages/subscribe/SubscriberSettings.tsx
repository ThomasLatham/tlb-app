import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState, Fragment } from "react";
import { Tag } from "@prisma/client";
import _ from "lodash";

import ButtonBasic from "@/components/buttonBasic";
import ButtonTogglable from "@/components/buttonTogglable";

interface SubscriberSettingsProps {
  session: Session | null | undefined;
}

const SubscriberSettings: React.FC<SubscriberSettingsProps> = ({ session }) => {
  const [allTags, setAllTags] = useState<string[]>();
  const [selectedTags, setSelectedTags] = useState<string[]>();
  const [subscribedTags, setSubscribedTags] = useState<string[]>();
  const [updateStatus, setUpdateStatus] = useState<string>("");

  // get subscribed tags
  useEffect(() => {
    if (session?.user?.email)
      fetch("/api/v1/users/self", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setSubscribedTags(data?.user?.tags?.map((tag: Tag) => tag.tagName));
          setSelectedTags(data?.user?.tags?.map((tag: Tag) => tag.tagName));
        });
  }, [session]);

  // get all tags
  useEffect(() => {
    fetch("/api/v1/tags", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setAllTags(data.tags.map((tag: Tag) => tag.tagName));
      });
  }, []);

  // make updateStatus disappear 5 seconds after not being emtpy
  useEffect(() => {
    if (updateStatus) {
      setTimeout(() => {
        setUpdateStatus("");
      }, 5000);
    }
  }, [updateStatus]);

  const handleUpdatePreferences = () => {
    console.log("sent tags: " + selectedTags);
    fetch("/api/v1/users/self/tags", {
      method: "PUT",
      body: JSON.stringify({
        tags: selectedTags,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong.");
      })
      .then((responseJson) => {
        const newTags = (responseJson.user.tags as Tag[]).map((tag) => "#" + tag.tagName);
        setUpdateStatus(
          (newTags.length
            ? "You are now subscribed to the following tags: " + newTags.join(", ") + "."
            : "Successfully unsubscribed from all emails.") +
            " This message will disappear after 5 seconds."
        );
      })
      .catch((error: Error) => {
        setUpdateStatus(error.message + +" This message will disappear after 5 seconds.");
      });
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <p className="text-center">
        Welcome, {session?.user?.name ?? session?.user?.email?.split("@")[0]}!
        <span className="sm:ml-5">
          <ButtonBasic onClick={() => signOut()}>Sign Out</ButtonBasic>
        </span>
      </p>
      <p className="text-center mx-10 md:mx-20 lg:mx-40 mt-5">
        {`
          To subscribe, please select from the #tags below and click "Update Preferences" to confirm your selection.
          To unsubscribe, deselect all #tags and click "Update Preferences."
          If you're subscribed to a tag, then you'll get an email whenever a post with that tag gets published.
          New posts come out every 1-2 months.
        `}
      </p>
      <form
        className="flex flex-col items-center mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePreferences();
        }}
      >
        {subscribedTags ? (
          <TagSelector
            allTags={allTags ?? []}
            selectedTags={selectedTags ?? []}
            setSelectedTags={setSelectedTags}
            initialSelectedTags={subscribedTags}
          ></TagSelector>
        ) : (
          <Fragment></Fragment>
        )}
        <div className="mt-2">
          <ButtonBasic type="submit">Update Preferences</ButtonBasic>
        </div>
        <p className="text-center mx-10 md:mx-20 lg:mx-40 mt-5">{updateStatus}</p>
      </form>
    </div>
  );
};

interface TagSelectorProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  initialSelectedTags: string[];
}

const TagSelector: React.FC<TagSelectorProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
  initialSelectedTags,
}) => {
  const toggleTag = (tag: string) => {
    let selectedTagsClone = _.cloneDeep(selectedTags);
    if (selectedTags.includes(tag)) {
      selectedTagsClone = selectedTagsClone.filter((selectedTag) => selectedTag !== tag);
    } else {
      selectedTagsClone = [...selectedTags, tag];
    }

    setSelectedTags(selectedTagsClone);
  };
  return (
    <div className="flex flex-wrap mt-2">
      {allTags.map((tag, idx) => {
        return (
          <div className="mx-2" key={idx}>
            {initialSelectedTags ? (
              <ButtonTogglable
                type="button"
                onClick={() => toggleTag(tag)}
                isToggledInitially={initialSelectedTags.includes(tag)}
              >{`#${tag}`}</ButtonTogglable>
            ) : (
              <Fragment></Fragment>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubscriberSettings;
